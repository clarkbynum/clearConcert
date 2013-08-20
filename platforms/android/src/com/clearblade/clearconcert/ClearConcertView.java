package com.clearblade.clearconcert;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewClient;
import org.apache.cordova.DroidGap;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.net.http.SslError;
import android.os.Build;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;

public class ClearConcertView extends CordovaWebViewClient {
	
	ClearConcertAndroid ctx;
	
	public ClearConcertView(DroidGap ctx) {
		super(ctx);
		this.ctx = (ClearConcertAndroid) ctx;
	}
	
	@Override
	public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
		System.out.println("onReceivedSslError. Proceed? " + ctx.allowUntrusted);
		if (ctx.allowUntrusted) {
			handler.proceed();
		} else {
			handler.cancel();
		}
	}
}
