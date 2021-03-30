import { from, Observable, of, throwError } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { IUser } from "../domain/models/user.model";
import * as fs from 'fs';
import { NotFoundException } from "@nestjs/common";

const { readFile, writeFile } = fs.promises;

export const IUserRepositoryToken = 'IUSER_REPOSITORY';

export interface IUserRepository {
  add(user: IUser) : Observable<IUser | Error>;
  getBy(userId: number) : Observable<IUser | NotFoundException>;
}

export class FileBasedUserRepository implements IUserRepository {
  private _users: IUser[];
  private readonly _filePath = 'user-db.json';

  constructor() {
    from(this._init()).pipe(tap(console.log)).subscribe((users: string) => {
      if (!users) users = '[]';
      this._users = JSON.parse(users);
    });
  }

  add(user: IUser): Observable<IUser | Error> {
    if (this._users.find(u => u.email === user.email))
      return throwError(new Error("User already exists"))

    const id = this._users.length + 1;
    const userToAdd = { id, ...user };

    this._users.push(userToAdd);

    return from(
      this._writeToFile(JSON.stringify(this._users, null, 2))
    ).pipe(map(() => userToAdd));
  }

  getBy(userId: number): Observable<IUser | NotFoundException> {
    const user = this._users.find(u => u.id === userId);

    if (!user) return throwError(new NotFoundException());

    return of(user);
  }

  private _init = () : Promise<string> => {
    return readFile(this._filePath, {
      flag: "r",
      encoding: "utf8"
    }).catch(() => {
      return this._writeToFile('').then(() => '');
    });
  }

  private _writeToFile = (data: string) : Promise<void> => {
    return writeFile(this._filePath, data, { flag: 'w', encoding: 'utf8' });
  }
}
