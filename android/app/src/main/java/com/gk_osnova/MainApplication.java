package ru.yksoft.gk_osnova;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.dylanvann.fastimage.FastImageViewPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;

import com.burnweb.rnsendintent.RNSendIntentPackage;

import com.reactnativecommunity.netinfo.NetInfoPackage;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;

import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

import com.henninghall.date_picker.DatePickerPackage;

import com.reactnativecommunity.webview.RNCWebViewPackage;

import com.rnfs.RNFSPackage;

import com.imagepicker.ImagePickerPackage;

import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
             new AsyncStoragePackage(),
             new RNFirebasePackage(),
             new RNFirebaseMessagingPackage(),
             new RNFirebaseNotificationsPackage(),
             new FastImageViewPackage(),
             new RNFSPackage(),
             new RNFileViewerPackage(),
             new RNDeviceInfo(),
             new RNSendIntentPackage(),
             new NetInfoPackage(),
             new ReactNativeContacts(),
             new RNFirebaseCrashlyticsPackage(),
             new DatePickerPackage(),
             new RNCWebViewPackage(),
             new ImagePickerPackage(),
             new DocumentPickerPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
