import React from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useSkills } from '@/hooks/use-skills';
import { useExperience } from '@/hooks/use-experience';
import { Loader2, MapPin, Calendar, Briefcase } from 'lucide-react';

export default function AboutApp() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: experience, isLoading: loadingExp } = useExperience();

  const isLoading = loadingProfile || loadingSkills || loadingExp;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-white text-black font-body text-sm selection:bg-[#000080] selection:text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 border-b border-[#808080] pb-4">
          <div className="w-24 h-24 bg-[#c0c0c0] win98-inset p-1 flex items-center justify-center">
            <img
              src="https://api.iconify.design/lucide/user-round.svg?color=%23000080&width=64"
              alt="User Icon"
              className="w-16 h-16 opacity-50"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1">{profile?.name || 'Sahil Kumar'}</h1>
            <p className="text-[#000080] font-bold mb-2">{profile?.role || 'Frontend Developer'}</p>
            <div className="flex flex-wrap gap-4 text-xs text-[#808080]">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{profile?.location || 'India'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{profile?.experience || '3 Years'} of experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <section>
          <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Profile</h2>
          <div className="win98-inset p-3 bg-white text-gray-800 leading-relaxed italic">
            " {profile?.bio || 'Creative frontend developer building immersive and interactive web experiences.'} "
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 px-1">
            {skills?.map((skill: any) => (
              <div key={skill.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-4 bg-[#c0c0c0] win98-inset overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-[#000080] to-[#1084d0]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section>
          <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Work Experience</h2>
          <div className="space-y-4">
            {experience?.map((exp: any) => (
              <div key={exp._id} className="win98-inset p-3 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={14} className="text-[#000080]" />
                  <h3 className="font-bold">{exp.role}</h3>
                </div>
                <p className="text-xs text-[#808080] mb-2">{exp.duration}</p>
                <p className="text-sm text-gray-700 leading-tight">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
