export class User {
  constructor(authData, profileData = {}) {
    this.id = authData.uid;
    this.email = authData.email;
    this.name = profileData.displayName || authData.displayName;
  }

  get shortName() {
    return this.name.split(' ')[0]; // Возвращаем только первое имя для краткого отображения
  }
}