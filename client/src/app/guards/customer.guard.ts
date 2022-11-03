import { Injectable, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CustomerGuard implements CanActivate {

    public constructor(private router: Router) { }

    public canActivate(): boolean {
        const userType = localStorage.getItem("userType");
        if (userType == "CUSTOMER") {
            return true;
        }

        this.router.navigateByUrl("/login");
        return false;
    }

 }
