
#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <Cordova/CDVFile.h>
#import <Cordova/NSArray+Comparisons.h>
#import <GD/GDFileSystem.h>


@interface GDCFileTransferPlugin : CDVPlugin

- (void) upload:(CDVInvokedUrlCommand *)command;
- (void) download:(CDVInvokedUrlCommand *)command;

@end


