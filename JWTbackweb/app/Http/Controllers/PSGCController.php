<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class PSGCController extends Controller
{
    public function getRegions()
    {
        $response = Http::get('https://psgc.gitlab.io/api/regions/');
        return $response->json();
    }

    public function getProvinces()
    {
        $response = Http::get('https://psgc.gitlab.io/api/provinces/');
        return $response->json();
    }

    public function getCitiesMunicipalities()
    {
        $response = Http::get('https://psgc.gitlab.io/api/cities-municipalities/');
        return $response->json();
    }

    public function getBarangays()
    {
        $response = Http::get('https://psgc.gitlab.io/api/barangays/');
        return $response->json();
    }
}
