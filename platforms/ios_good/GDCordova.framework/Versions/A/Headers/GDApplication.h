/**
 * @name GDApplication
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "GDCBasePlugin.h"
#import <GD/GDios.h>

@interface GDCApplicationPlugin : GDCBasePlugin

-(void)getApplicationConfig:(CDVInvokedUrlCommand*)command;
-(void)showPreferenceUI:(CDVInvokedUrlCommand*)command;
-(void)getVersion:(CDVInvokedUrlCommand*)command;

@end
