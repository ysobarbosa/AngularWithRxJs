import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private subject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this.subject
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));
  // cria um observable identico ao subject, exceto que o errors$ não tem a capacidade de emitir novos valores diretamente, apenas podem ser subscritos

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }
}
