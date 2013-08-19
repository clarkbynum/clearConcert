

#import <Foundation/Foundation.h>
#import <GD/sqlite3enc.h>

#import <Cordova/CDV.h>

@interface GDCSQLitePlugin : CDVPlugin

-(void) open:(CDVInvokedUrlCommand*)command;
-(void) backgroundExecuteSqlBatch:(CDVInvokedUrlCommand*)command;
-(void) backgroundExecuteSql:(CDVInvokedUrlCommand*)command;
-(void) executeSqlBatch:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) executeSqlWithDict:(NSMutableDictionary*)options;
-(void) executeSql:(CDVInvokedUrlCommand*)command;
-(void) _executeSqlBatch:(NSMutableDictionary*)options;
-(void) _executeSql:(NSMutableDictionary*)options;
-(void) close: (CDVInvokedUrlCommand*)command;

@end
