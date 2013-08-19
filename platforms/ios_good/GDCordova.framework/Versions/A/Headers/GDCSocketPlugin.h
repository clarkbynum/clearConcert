//
//  GDCSocketPlugin.h
//  GDCordova
//
//  Created by Good Technology, Inc. on 7/5/12.
//  Copyright (c) 2013 Good Technology. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "GDCBasePlugin.h"
#import <GD/GDNETiOS.h>

@interface GDCSocketPlugin : GDCBasePlugin <GDSocketDelegate> 

-(void)connect:(CDVInvokedUrlCommand *)command;
-(void)send:(CDVInvokedUrlCommand *)command;
-(void)close:(CDVInvokedUrlCommand *)command;

@end
