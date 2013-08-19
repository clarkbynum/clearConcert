/**
 * @name GDCommunication
 */

#import <Cordova/CDV.h>
#import <GD/GDNETiOS.h>
#import "GDCBasePlugin.h"

@interface GDCHttpRequestPlugin : GDCBasePlugin <GDHttpRequestDelegate>

-(void)send:(CDVInvokedUrlCommand*)command;
-(void)clearCredentialsForMethod:(CDVInvokedUrlCommand*)command;
-(void)kerberosAllowDelegation:(CDVInvokedUrlCommand*)command;

@end
