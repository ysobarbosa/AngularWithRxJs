import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /*
   * BehaviorSubject lembra o ultimo valor emitido pelo subject, e qualquer novo subscriber recebe esse valor, caso nenhum   valor tenha sido emitido.
   * Todo component que precise de um valor emitido pelo loading$ possa receber pelo menos o último valor emitido, mesmo que a subscription aconteça apenas após a emissão do valor
   *
   * Apenas o loadingService emitirá os valores, mas todo componente poderá se inscrever a esses valores. Por isso, em vez de expor diretamente o subject, chamaremos o loadingSubject como um asObservable(). Isso criará um observable a partir do subject, que emitirá exatamente os mesmos valores que ele, mas como um simples observable.
   * Assim, ao se subscrever no subject, os componentes poderão apenas coletar os dados, mas não poderá manipulá-los
   */

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log("Loading service created...");
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // O tipo <T> não precisa ser chamado em outros lugares, ex: chamada no home component
    return of(null) // cria um observable com o valor null
      .pipe(
        tap(() => this.loadingOn()),
        concatMap(() => obs$),
        finalize(() => this.loadingOff())
      );
    //finalize: "call a specified function when the source terminates on complete or error". Caso haja erro, o loading não fica ativo no meio da tela.
  }
  /* concatMap: Projects each source value to an Observable which is merged in the output Observable, in a serialized fashion waiting for each one to complete before merging the next. */

  loadingOn() {
    this.loadingSubject.next(true);
    // next emite valores novos para o subject
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
