import { Injectable, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    public constructor(private router: Router) { }

    public canActivate(): boolean {
        const userType = localStorage.getItem("userType");
        if (userType == "ADMIN") {
            return true;
        }

        this.router.navigateByUrl("/login");
        return false;
    }

}
