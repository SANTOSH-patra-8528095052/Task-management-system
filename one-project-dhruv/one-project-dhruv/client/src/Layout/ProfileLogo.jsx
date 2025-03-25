import React from 'react'

function ProfileLogo({name}) {
  const firstNameInitial = name

  return (
    <span className="user-profile-logo">
      user : {firstNameInitial}
    </span>
  );
}

export default ProfileLogo