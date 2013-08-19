package com.clearblade.clearconcert;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.DroidGap;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;

public class CertificatesPlugin extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("setUntrusted")) {
            boolean allowUntrusted = args.getBoolean(0);
            System.out.println("Setting allowUntrusted to " + allowUntrusted);
            ClearConcertAndroid cc = (ClearConcertAndroid) this.cordova.getActivity();
            webView.clearSslPreferences();
            webView.clearCache(true);
            cc.allowUntrusted = allowUntrusted;
            cc.clearCache();
            callbackContext.success();
            return true;
        }
        callbackContext.error("Invalid Command");
        return false;
    }
    
    public void setUntrusted() {
    }
}