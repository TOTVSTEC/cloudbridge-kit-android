package <%= id %>;

import android.os.Bundle;

import com.totvs.smartclient.SmartClientActivity;

public class <%= name %>Activity extends SmartClientActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.setCloudBridgeProgram("<%= name %>");
    }

}
