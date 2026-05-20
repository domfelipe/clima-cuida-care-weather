import type { ProfileId, UseProfile } from '../types';

interface ProfileSelectorProps {
  profiles: UseProfile[];
  value: ProfileId;
  onChange: (profile: ProfileId) => void;
}

export function ProfileSelector({ profiles, value, onChange }: ProfileSelectorProps) {
  return (
    <fieldset className="profile-selector">
      <legend>Perfil</legend>
      <div className="profile-options">
        {profiles.map((profile) => (
          <label key={profile.id} className={profile.id === value ? 'selected' : ''}>
            <input
              type="radio"
              name="profile"
              value={profile.id}
              checked={profile.id === value}
              onChange={() => onChange(profile.id)}
            />
            <span>{profile.shortLabel}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
