package <%= project.id %>;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import com.totvs.smartclient.SmartClientActivity;
import java.util.ArrayList;

public class <%= project.name %>Activity extends SmartClientActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            this.checkPermissions();
        }
    }

    @TargetApi(Build.VERSION_CODES.M)
    public void checkPermissions() {
        ArrayList<String> permissions = new ArrayList<>();

        Context context = this.getApplicationContext();
        String packageName = context.getPackageName();

        try {
            PackageInfo info = getPackageManager().getPackageInfo(packageName, PackageManager.GET_PERMISSIONS);

            if (info.requestedPermissions != null) {
                for (String p : info.requestedPermissions) {
                    if (this.checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED)
                        permissions.add(p);
                }
            }

            if (permissions.size() > 0) {
                this.requestPermissions(permissions.toArray(new String[0]), 999);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
