import { makeAutoObservable } from "mobx";

export default class FileStore {
  constructor() {
    makeAutoObservable(this);
  }
}
