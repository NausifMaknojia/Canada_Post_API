<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function store(Request $request){
        $users = new User;
        $request->validate([
            'email'=>'required|email|unique:users',
            'pass'=>'required|min:3|max:20'
        ]);

            $users->f_name = $request->f_name;
            $users->l_name = $request->l_name;
            $users->email = $request->email;
            $users->mob = $request->mob;
            $users->province = $request->province;
            $users->city = $request->city;
            $users->pass = Hash::make($request->c_pass);
           // $users->remember_token = $users->createToken('my-app-token')->plainTextToken;
            $users->save();
//try to get automatically login
            return response()->json(['message'=>'User added'],200);


    }

    public function checkUser(Request $request){
        // error_log('Some message here.');
        $user = user::where('email', '=', $request->email)->first();
        if ($user === null) {
        // user doesn't exist
        return response()->json(['status'=> 0,'message' => 'User does not exists','data' => $user ]);
    }else{
        return response()->json(['status'=> 1,'message' => 'User exists','data' => $user->email ]);
    }
}


public function UserLogin(Request $request){
    $request->validate([
        'email'=>'required|email',
        'pass'=>'required|min:3|max:20'
    ]);

        $user = user::where('email', '=', $request->email)->first();
        if ($user === null) {
        // user doesn't exist
        return response()->json(['status'=> 0,'message' => 'User does not exists','data' => null ]);
        }else{
            //check password
            if(Hash::check($request->pass,$user->pass)){
              //  $request->session()->put('loggedUser',$user->id);
              $user->tokens()->where('tokenable_id', $user->id)->delete(); // delete old token
              $token = $user->createToken('login_token')->plainTextToken; // generate new token
                return response()->json(['status'=> 1,'message' => 'Loggin successful','data' => $user,'token' => $token ]);
            }else{
                return response()->json(['status'=> 0,'message' => 'Password incorrect','data' => 'null' ]);;
            }
        }
}


public function fetchData(Request $request){
        $user = DB::table('users')
        ->where([
                    ['id', '=', $request->id]
                ])->first();
        if ($user === null) {
        // user doesn't exist
        return response()->json(['status'=> 0,'message' => 'User does not exists','data' => null ]);
        }else{
                return response()->json(['status'=> 1,'message' => 'Data fetched','data' => $user ]);
            }
        }

//  ======================================================= canada post API  =====================================================


public function CanadaPostgetRates(Request $request){

        // CPCWS_Rating_PHP_Samples\REST\rating\user.ini
        // $userProperties = parse_ini_file(realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . '/../../../user.ini');

        $username = '881a01ed5368019f';
        $password = '16e56fa09b3ca9ba64e2f3';
        $mailedBy = '0009859427';

        // REST URL
        $service_url = 'https://ct.soa-gw.canadapost.ca/rs/ship/price';

        // Create GetRates request xml
        $originPostalCode = str_replace(' ','',strtoupper($request->from));     //give space in first ''
        $postalCode =       str_replace(' ','',strtoupper($request->to));
        $length =           str_replace(' ','',$request->length);
        $width =            str_replace(' ','',$request->width);
        $height =           str_replace(' ','',$request->height);
        $weight =           str_replace(' ','',$request->weight);

        $xmlRequest = <<<XML
        <?xml version="1.0" encoding="UTF-8"?>
        <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
        <customer-number>{$mailedBy}</customer-number>
        <parcel-characteristics>
        <weight>{$weight}</weight>
        <!-- <dimensions>
            <length>{$length}</length>
            <width>{$width}</width>
            <height>{$height}</height>
        </dimensions> -->

        </parcel-characteristics>
        <origin-postal-code>{$originPostalCode}</origin-postal-code>
        <destination>
            <domestic>
            <postal-code>{$postalCode}</postal-code>
            </domestic>
        </destination>
        </mailing-scenario>
        XML;

        $curl = curl_init($service_url); // Create REST Request
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($curl, CURLOPT_CAINFO, realpath(app_path()) .'/Http/Controllers/CanadaPostFiles/cacert.pem');
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $xmlRequest);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, $username . ':' . $password);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/vnd.cpc.ship.rate-v4+xml', 'Accept: application/vnd.cpc.ship.rate-v4+xml'));
        $curl_response = curl_exec($curl); // Execute REST Request
        if(curl_errno($curl)){
          //  echo 'Curl error: ' . curl_error($curl) . "\n";
        }

      //  echo 'HTTP Response Status: ' . curl_getinfo($curl,CURLINFO_HTTP_CODE) . "\n";
        curl_close($curl);

        // Example of using SimpleXML to parse xml response
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string('<root>' . preg_replace('/<\?xml.*\?>/','',$curl_response) . '</root>');
        if (!$xml) {
            echo 'Failed loading XML' . "\n";
            echo $curl_response . "\n";
            foreach(libxml_get_errors() as $error) {
                return response()->json(['status'=> 0,'message' => $error->message]);
            }
        } else {
            if ($xml->{'price-quotes'} ) {
                $priceQuotes = $xml->{'price-quotes'}->children('http://www.canadapost.ca/ws/ship/rate-v4');
                if ( $priceQuotes->{'price-quote'} ) {
                    foreach ( $priceQuotes as $priceQuote ) {
                        $service_name[''.$priceQuote->{'service-name'}] =   array(''.$priceQuote->{'price-details'}->{'due'}, ''.$priceQuote->{'service-standard'}->{'expected-delivery-date'}) ; //'' just to avoid error
                        $price_details[] = ''.($priceQuote->{'price-details'}->{'due'});
                    }
                    return response()->json(['status'=>1, 'data1'=>$service_name, 'data2'=> $price_details]);

                }
            }
            if ($xml->{'messages'} ) {
                $messages = $xml->{'messages'}->children('http://www.canadapost.ca/ws/messages');
                foreach ( $messages as $message ) {
                    return response()->json(['status'=>400, 'Error Code'=> $message->code, 'message'=> $message->description]);
                }
            }

        }

}


}
