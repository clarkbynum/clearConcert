//
//  GDAppDelegate.m
//  GDCordova
//
//  Created by kburke on 6/11/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "GDAppDelegate.h"
#import "AppDelegate.h"

// BEGIN: Private interface

@interface GDAppDelegate ()

#if !(__has_feature(objc_arc))
@property (nonatomic, __unsafe_unretained) UIApplication* savedApplication;
#else
@property (nonatomic, weak) UIApplication* savedApplication;
#endif
@property (nonatomic, retain) NSDictionary* savedLaunchOptions;

@end
// ---------------------------



@implementation GDAppDelegate

@synthesize gdLibrary;
@synthesize savedApplication;
@synthesize savedLaunchOptions;

// *** change the app ID and version here to the ID and version enabled on the GC
NSString* kappId = @"com.clearblade.clearconcert.good";
NSString* kappVersion = @"0.0.1";

- (BOOL) application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{    
    [GDiOS initializeWithClassConformingToUIApplicationDelegate:[self class]];
    gdLibrary = [GDiOS sharedInstance];
    gdLibrary.delegate = self;
    
    // Start up the Good Library.
    [gdLibrary authorise:kappId andVersion:kappVersion];
    [self.window makeKeyAndVisible];
    
    return YES;
}

-(void)handleEvent:(GDAppEvent*)anEvent
{
	// Called from gdLibrary when events occur, such as system startup.
	
    switch (anEvent.type) 
    {
		case GDAppEventAuthorised: 
        {
            [self onAuthorised:anEvent];
			break;
        }
		case GDAppEventNotAuthorised: 
        {
            [self onNotAuthorised:anEvent];
			break;
        }
		case GDAppEventRemoteSettingsUpdate:
        {
            // handle changes here
			break;
        }
		case GDAppEventPolicyUpdate:
        {
            // handle changes here
			break;
        }
		case GDAppEventServicesUpdate:
        {
            // handle changes here
			break;
        }
    }
}

-(void) onAuthorised:(GDAppEvent*)anEvent 
{
    // Handle the Good Libraries authorised event.                     
	
    switch (anEvent.code) {
        case GDErrorNone: {
            // ***** Add Custom Action Here or call super class *****
			[super appStart:savedApplication withOptions:savedLaunchOptions];
            break;
        }
        default:
            NSAssert(false, @"Authorised startup with an error");
            break;
    }
}

-(void) onNotAuthorised:(GDAppEvent*)anEvent 
{
    // Handle the Good Libraries not authorised event.
	
    switch (anEvent.code) {
        case GDErrorActivationFailed:
        case GDErrorProvisioningFailed:
        case GDErrorPushConnectionTimeout: {
            // application can either handle this and show it's own UI or just call back into
            // the GD library and the welcome screen will be shown            
            [gdLibrary authorise:kappId andVersion:kappVersion];
            break;
        }
        case GDErrorSecurityError:
        case GDErrorAppDenied:
        case GDErrorBlocked:
        case GDErrorWiped:
        case GDErrorRemoteLockout: 
        case GDErrorPasswordChangeRequired: {
            // an condition has occured denying authorisation, an application may wish to log these events
            NSLog(@"onNotAuthorised %@", anEvent.message);
            break;
        }
        case GDErrorIdleLockout: {
            // idle lockout is benign & informational
            break;
        }
        default: 
            NSAssert(false, @"Unhandled not authorised event");
            break;
    }
}

@end
