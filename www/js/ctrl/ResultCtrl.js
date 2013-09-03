angular.module('clearConcert')
.controller('ResultCtrl',['$scope', '$location', '$loadDialog', '$routeParams', 'resultData',
                          'orderByFilter', 'filterFilter', 'Favorites',
		function($scope, $location, $loadDialog, $routeParams,resultData, orderByFilter, filterFilter,
				  Favorites){

			var PAGE_SIZE = 25;
			var nextPageUrl;
			
			$scope.projectId = $routeParams.projectId;
			$scope.queryId = $routeParams.queryId;

			$scope.results = [];
			$scope.totalResults = -1;
			
			$scope.isFav = Favorites.checkFav($scope.projectId, $scope.queryId, favoriteTypes.QUERY);
			
		

			$scope.fetch = function() {
			
				var promise = resultData.fetch(PAGE_SIZE).then(function(result) {
				
					
					
					$scope.results = result.items;
		

					nextPageUrl = result.next;
					$scope.totalResults = result.total;
				});
		
				$loadDialog.waitFor(promise, "Loading Results");
			};

			$scope.loadMore = function() {
				if ($scope.remaining() > 0 && $scope.results.length > 0) {
					var promise = resultData.loadMore(nextPageUrl).then(function(result) {
						nextPageUrl = result.next;
						$scope.results = result.items;
					});
					moreTracker.addPromise(promise);
				}
			};
			
			$scope.addFavorite = function() {
				console.log("adding favorite");
				var newFav = Favorites.newQueryFav($scope.projectId, $scope.queryId, favoriteTypes.QUERY);
				Favorites.addFav(newFav);
				$scope.isFav = true;
			};
			
			$scope.removeFavorite = function() {
				console.log("remove");
				Favorites.removeFav($scope.projectId, $scope.queryId, favoriteTypes.QUERY);
				$scope.isFav = false;
			}

			$scope.refresh = function() {
				resultData.clear();
				$scope.fetch();
				$scope.results = [];
			};
			$scope.remaining = function() {
				//console.log('remaining');
				return $scope.totalResults - $scope.results.length;
			};



			$scope.filterResults = function(results) {

		
				if (!$scope.showResolved) {
					results = results.filter(function(item) {
						console.log(item);
						return !item.item['rtc_cm:resolved'];
					});
				}
	
				if ($scope.resultFilterInput) {

					results = filterFilter(results, $scope.resultFilterInput);
				}
				var resultWorkItemOrder = orderByFilter(results, function(item) {
					return item.identifier;
				});
				return orderByFilter(resultWorkItemOrder, function(item){
					return item.resource['dc:type']['dc:title'];
				});
			};

			$scope.go = function(wi){
		
				console.log(wi);
				if (wi == ''){
					$location.path('/');
					return;
				}
				$location.path('/workitem/' + wi.identifier)
			};


			$scope.isFavorite = resultData.isFavorite;
			$scope.title = resultData.title();
			

			if (resultData.advancedFilterOptions) {
				$scope.showResolvedSwitchEnabled = true;
				$scope.showResolved = false;
			} else {
				$scope.showResolved = true;
			}

			$scope.fetch();
		}])
.factory('SearchResultData', ['search', 'catalog', '$timeout', function(search, catalog, $timeout) {
	return function createSearchResultData(query, projectId) {
		return {
			advancedFilterOptions: true,
			title: function() {
				return query + ': ' + catalog.byId(projectId).title;
			},
			fetch: function(pageSize) {

	
			
				return search.getResultsForProject(projectId, query, pageSize);
			},
			//Use $timeout to make sure we load for at least a short time, or else
			//it just looks like ugly scrolling if our internet is too fast and we
			//get the results back before 'Loading More' appears
			loadMore: function(pageUrl) {
				var timeoutPromise = $timeout(function(){}, 750);
				return search.getMoreResults(pageUrl).then(function(result) {
					return timeoutPromise.then(function() {
						return result;
					});
				});
			},
			clear: function() {
				search.clearCache();
			}
		};
	};
}])
.factory('QueryResultData', ['query', 'catalog', '$q', '$timeout', function(query, catalog, $q, $timeout) {
	return function createQueryResultData(projectId, queryId) {

		//We can't actually page the query results from the server because rtc 
		//forces us to fetch them all at once. But we do page them client side
		//for performance reasons, so we don't have too many items in the DOM at 
		//once.  
		//We get the whole list from the server, then give it out slowly like
		//it's pulling from the server. We even fake a little load time with a
		//timeout so it looks like it's pulling down more.  Otherwise, it will just
		//look like sloppy scrolling :-)
		var pageSize, currentPage, fullResult;
		function getNextPage() {
			var max = Math.min(pageSize * (1+currentPage), fullResult.items.length);
			var min = pageSize * currentPage;
			currentPage++;
			return fullResult.items.slice(min, max);
		}

		return {
			advancedFilterOptions: false,
				title: function() {
					return queryId + ': ' + catalog.byId(projectId).title;
				},
				fetch: function(_pageSize) {
					pageSize = _pageSize;
					currentPage = 0;
					fullResult = [];
					return query.resultsForQuery(projectId, queryId, pageSize)
						.then(function(result) {
							fullResult = result;
							return {
								items: getNextPage(),
							total: result.items.length
							};
						});
				},
				loadMore: function() {
					return $timeout(function(){},750).then(function() {
						return $q.when({
							items: getNextPage(),
						total: fullResult.items.length
						});
					});
				},
				clear: function() {
					query.clearCache();
				}
		};
	};
}]);
