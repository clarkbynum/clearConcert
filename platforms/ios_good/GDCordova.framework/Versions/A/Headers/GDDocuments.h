/**
 * @name GDDocuments
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "GDCBasePlugin.h"
#import <GD/GDSecureDocs.h>

@interface GDCDocumentsPlugin : GDCBasePlugin

-(void)canSendFileToGFE:(CDVInvokedUrlCommand*)command;
-(void)canSendFileToApplication:(CDVInvokedUrlCommand*)command;
-(void)sendFileToGFE:(CDVInvokedUrlCommand*)command;
-(void)sendFileToApplication:(CDVInvokedUrlCommand*)command;

@end
