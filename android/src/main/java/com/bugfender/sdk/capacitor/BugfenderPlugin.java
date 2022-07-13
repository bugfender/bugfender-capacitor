package com.bugfender.sdk.capacitor;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Bugfender")
public class BugfenderPlugin extends Plugin {

    private Bugfender implementation = new Bugfender();

    @PluginMethod
    public void log(PluginCall call) {
        String value = call.getString("obj");

        JSObject ret = new JSObject();
        ret.put("obj", implementation.log(value));
        call.resolve(ret);
    }
}
