import React from 'react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotification();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1090, maxWidth: '380px', width: '100%' }}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`toast show shadow-lg mb-2 border-0 rounded-4 overflow-hidden animate-slide-in text-white ${
            n.type === 'success'
              ? 'bg-success'
              : n.type === 'danger'
              ? 'bg-danger'
              : n.type === 'warning'
              ? 'bg-warning text-dark'
              : 'bg-primary'
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header bg-black bg-opacity-25 text-white border-0 py-2">
            <i
              className={`bi me-2 ${
                n.type === 'success'
                  ? 'bi-check-circle-fill'
                  : n.type === 'danger'
                  ? 'bi-exclamation-triangle-fill'
                  : n.type === 'warning'
                  ? 'bi-exclamation-circle-fill'
                  : 'bi-bell-fill'
              }`}
            ></i>
            <strong className="me-auto">{n.title || 'CampusBite Alert'}</strong>
            <small className="text-white-50">Just now</small>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => removeNotification(n.id)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body py-2 px-3 fw-medium">
            {n.message}
          </div>
        </div>
      ))}
    </div>
  );
}
