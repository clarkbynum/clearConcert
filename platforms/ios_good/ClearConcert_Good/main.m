/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
//
//  main.m
//  ClearConcert_Good
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GDAppDelegate.h"
#import <GD/GDios.h>
/*
int main(int argc, char* argv[])
{
    @autoreleasepool {
        int retVal = UIApplicationMain(argc, argv, nil, @"AppDelegate");
        return retVal;
    }
}
*/
int main(int argc, char* argv[])
{
    int retVal = 0;
#if !(__has_feature(objc_arc))
    NSAutoreleasePool* pool = [[NSAutoreleasePool alloc] init];
#else
    @autoreleasepool {
#endif
        [GDiOS initialiseWithClassConformingToUIApplicationDelegate:[GDAppDelegate class]]; retVal = UIApplicationMain(argc, argv, nil, NSStringFromClass([GDAppDelegate class])); [GDiOS finalise];
#if !(__has_feature(objc_arc)) 
        [pool release];
#else 
    }
#endif
        return retVal;
    }