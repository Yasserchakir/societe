// src/components/MessageDisplay.js
import React from 'react';

const MessageDisplay = ({ error, success }) => {
  return React.createElement(
    React.Fragment,
    null,
    error && React.createElement(
      'p',
      { className: 'error-message animate-shake' },
      error
    ),
    success && React.createElement(
      'p',
      { className: 'success-message animate-bounce' },
      success
    )
  );
};

export default MessageDisplay;