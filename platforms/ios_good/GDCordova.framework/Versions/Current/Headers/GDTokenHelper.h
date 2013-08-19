/**
 * @name GDTokenHelper
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "GDCBasePlugin.h"
#import <GD/GDUtility.h>

@interface GDTokenHelperPlugin : GDCBasePlugin <GDAuthTokenDelegate>

-(void)getGDAuthToken:(CDVInvokedUrlCommand*)command;

@end