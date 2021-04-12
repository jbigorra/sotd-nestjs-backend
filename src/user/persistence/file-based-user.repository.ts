import { from, Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { IUserModel } from "../domain/models/user.model";
import * as fs from 'fs';
import { NotFoundException } from "@nestjs/common";

const { readFile, writeFile } = fs.promises;

export const IUserRepositoryToken = 'IUSER_REPOSITORY';

export interface IUserRepository {
  add(user: IUserModel) : Observable<IUserModel>;
  findById(userId: number) : Observable<IUserModel>;
  findByEmail(email: string) : Observable<IUserModel>;
}

export class FileBasedUserRepository implements IUserRepository {
  private _users: IUserModel[];
  private readonly _filePath = 'user-db.json';

  constructor(filePath) {
    this._filePath = filePath;

    from(this._init())
      .subscribe((users: string) => {
        if (!users) users = '[]';
        this._users = JSON.parse(users);
      });
  }

  add(user: IUserModel): Observable<IUserModel> {
    if (this._users.find(u => u.email === user.email))
      throw new Error("User already exists");

    const id = this._users.length + 1;
    const userToAdd = { id, ...user };

    this._users.push(userToAdd);

    return from(
      this._writeToFile(JSON.stringify(this._users, null, 2))
    ).pipe(map(() => userToAdd));
  }

  findById(userId: number): Observable<IUserModel> {
    const user = this._users.find(u => u.id === userId);

    if (!user) throw new NotFoundException();

    return of(user);
  }

  findByEmail(email: string): Observable<IUserModel> {
    const user = this._users.find(u => u.email === email);

    if (!user) throw new NotFoundException();

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
