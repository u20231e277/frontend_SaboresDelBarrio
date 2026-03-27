import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../models/api-dtos.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/users';

    getUsers(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(this.apiUrl);
    }

    getUserById(id: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${this.apiUrl}/${id}`);
    }

    createUser(user: UserDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(this.apiUrl, user);
    }

    updateUser(id: number, user: UserDTO): Observable<UserDTO> {
        return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
