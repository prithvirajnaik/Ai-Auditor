import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { USE_CASES } from '../../lib/pricing';

interface ProfileFormProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  domainName: string;
  setDomainName: (val: string) => void;
  teamSize: number;
  setTeamSize: (val: number) => void;
  primaryUseCase: string;
  setPrimaryUseCase: (val: string) => void;
  errors: { companyName?: string; domainName?: string; teamSize?: string };
}

export default function ProfileForm({
  companyName,
  setCompanyName,
  domainName,
  setDomainName,
  teamSize,
  setTeamSize,
  primaryUseCase,
  setPrimaryUseCase,
  errors
}: ProfileFormProps) {
  return (
    <div className="bg-[#090909] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
      <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono border-b border-white/5 pb-2">
        1. Organization Profile
      </h3>

      <div className="space-y-3.5">
        <Input
          label="Company Name"
          placeholder="Acme Rockets Inc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={errors.companyName}
        />

        <Input
          label="Corporate Domain"
          placeholder="acme-rockets.com"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          error={errors.domainName}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            label="Team Size"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
            error={errors.teamSize}
          />

          <Select
            label="Primary Use Case"
            value={primaryUseCase}
            onChange={(e) => setPrimaryUseCase(e.target.value)}
            options={USE_CASES}
          />
        </div>
      </div>
    </div>
  );
}
