import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { MatSnackBar } from "@angular/material/snack-bar";



@Injectable()
export class LogUpdateService {

  constructor(private updates: SwUpdate,private snackbar: MatSnackBar) {

    this.updates.available.subscribe(evt => {
        const snack = this.snackbar.open('Mise à jour disponible', 'Relancer',{ duration: 6000});
        snack
        .onAction()
        .subscribe(() => {
            // updates.activateUpdate().then(() => document.location.reload());
            window.location.reload();
        });
    });
    this.updates.checkForUpdate();
  }

  public updatesAvailable() : void {
    
    console.log("updates available ?");
    this.updates.available.subscribe(event => {
        console.log('current version is ' + event.current + '<br> available version is ' + event.available);
      });
      this.updates.activated.subscribe(event => {
        console.log('old version was ' + event.previous + '<br> new version is ' + event.current);
      });
  }
  
    public MettreAJourApp() {
        console.log("maj activée");
        this.updates.available.subscribe(event => {
            // if (event.current !== event.available) {
            this.updates.activateUpdate()
                            .then(() => document.location.reload())
                            .catch(err => { console.error(err);})
            })
        // }
    }

    public ouvrirSnackBar() {
        const snack = this.snackbar.open('Update Available', 'Reload',{ duration: 6000});
        snack
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });
    }


}