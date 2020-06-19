import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
    public CITIES = ["Rajahmundry", "Hyderabad", "Thiruvananthapuram", "Chennai", "Bangalore", "Pune", "Delhi", "Mumbai", "Ahmedabad", "Bengaluru"];
    public SPECIALIZATIONS = ["Medical Wards", "Operation Theater", "Medical Ward", "Maternity and Pediatric", "Orthopedics", "Surgical Wards", "ICU and Critical Care", "Oncology Ward", "Respiratory Ward"];
}