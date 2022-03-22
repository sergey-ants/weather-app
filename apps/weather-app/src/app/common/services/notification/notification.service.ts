import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { compact } from 'lodash';
import { NotificationLevel } from './enums/notification-level';

@Injectable()
export class NotificationService {
    private readonly defaultHideDurationMs = 3000;
    private readonly notificationLevelCssClassMap = new Map<NotificationLevel, string>([
        [NotificationLevel.Info, 'notification__info'],
        [NotificationLevel.Warning, 'notification__warning'],
        [NotificationLevel.Error, 'notification__error'],
    ]);

    private readonly notificationLoggerMap = new Map<NotificationLevel, (...data: string[]) => void>([
        [NotificationLevel.Info, console.info],
        [NotificationLevel.Warning, console.warn],
        [NotificationLevel.Error, console.error],
    ]);

    constructor(private readonly snackBar: MatSnackBar) {}

    public showNotification(message: string, level: NotificationLevel): void {
        const log = this.notificationLoggerMap.get(level) ?? console.log;

        log(message);

        this.snackBar.open(message, undefined, {
            duration: this.defaultHideDurationMs,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: compact(['notification', this.notificationLevelCssClassMap.get(level)]),
        });
    }
}
