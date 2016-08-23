package <%= project.id %>;

import android.os.Bundle;

import com.totvs.smartclient.SmartClientActivity;

public class <%= project.name %>Activity extends SmartClientActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.setCloudBridgeProgram("<%= project.name %>");
    }

}
