//
//  GDAppDelegate.h
//  GDCordova
//
//  Created by Good Technology on 6/11/12.
//  Copyright (c) 2012 Good Technology. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AppDelegate.h"
#import <GD/GDios.h>

@interface GDAppDelegate : AppDelegate <UIApplicationDelegate, GDiOSDelegate>

@property (nonatomic, weak) GDiOS *gdLibrary;

-(void) handleEvent:(GDAppEvent*)anEvent;
-(void) onAuthorised:(GDAppEvent*)anEvent;
-(void) onNotAuthorised:(GDAppEvent*)anEvent;

- (BOOL) application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions;

@end
