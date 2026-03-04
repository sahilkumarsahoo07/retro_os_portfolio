import React from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useSkills } from '@/hooks/use-skills';
import { useExperience } from '@/hooks/use-experience';
import { useCertifications } from '@/hooks/use-certifications';
import { useAchievements } from '@/hooks/use-achievements';
import { useProjects } from '@/hooks/use-projects';
import { Loader2, MapPin, Briefcase, Award, Trophy, Linkedin, Github, Phone, Mail, ExternalLink } from 'lucide-react';

export default function AboutApp({ type = 'about' }: { type?: string }) {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: experience, isLoading: loadingExp } = useExperience();
  const { data: certifications, isLoading: loadingCerts } = useCertifications();
  const { data: achievements, isLoading: loadingAchs } = useAchievements();
  const { data: projects, isLoading: loadingProjects } = useProjects();

  const isLoading = loadingProfile || loadingSkills || loadingExp || loadingCerts || loadingAchs || (type === 'about' && loadingProjects);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // The 'about' type is the full profile view
  const isFullProfile = type === 'about';

  return (
    <div className="h-full overflow-y-auto p-4 bg-white text-black font-body text-sm selection:bg-[#000080] selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Profile / Hero Section */}
        {isFullProfile && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Profile</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#dfdfdf] pb-6">
              <div className="w-32 h-32 bg-[#c0c0c0] win98-inset p-1 flex items-center justify-center shrink-0">
                <img
                  src="https://api.iconify.design/lucide/user-round.svg?color=%23000080&width=64"
                  alt="User Icon"
                  className="w-20 h-20 opacity-50 pixelated"
                />
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-2xl font-bold mb-1">{profile?.name || 'Sahil Kumar'}</h1>
                <p className="text-[#000080] font-bold text-base">{profile?.title || 'Full Stack Developer'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-600 font-bold">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#000080]" />
                    <span>Remote / India</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* About Me / Summary */}
        {isFullProfile && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">About Me</h2>
            <div className="win98-inset p-4 bg-white relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
              <p className="text-gray-800 leading-relaxed italic pl-2">
                "{profile?.summary || 'Creative software engineer building immersive web experiences.'}"
              </p>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {(isFullProfile || type === 'skills') && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills?.map((cat: any) => (
                <div key={cat.category} className="space-y-2 win98-inset p-3 bg-[#f0f0f0]">
                  <h3 className="font-bold text-[#000080] text-xs uppercase underline">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cat.skills.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-[#dfdfdf] border border-[#d0d0d0] win98-outset text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {(isFullProfile || type === 'contact') && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Contact Info</h2>
            <div className="win98-inset p-4 bg-[#dfdfdf] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={`mailto:${profile?.email || 'sahilkumarsahoo001@gmail.com'}`} className="flex items-center gap-3 p-2 bg-white win98-inset hover:bg-gray-50 transition-colors">
                <Mail size={16} className="text-[#000080]" />
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-bold text-gray-500">Email</p>
                  <p className="truncate font-mono text-xs">{profile?.email || 'sahilkumarsahoo001@gmail.com'}</p>
                </div>
              </a>
              <a href={`tel:${profile?.phone || '+918327704042'}`} className="flex items-center gap-3 p-2 bg-white win98-inset hover:bg-gray-50 transition-colors">
                <Phone size={16} className="text-[#000080]" />
                <div>
                  <p className="text-[9px] uppercase font-bold text-gray-500">Phone</p>
                  <p className="font-mono text-xs">{profile?.phone || '+91 8327704042'}</p>
                </div>
              </a>
              <a href={profile?.linkedin || 'https://www.linkedin.com/in/sahil-kumar'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 bg-white win98-inset hover:bg-gray-50 transition-colors">
                <Linkedin size={16} className="text-[#000080]" />
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-bold text-gray-500">LinkedIn</p>
                  <p className="truncate font-mono text-xs">sahil-kumar</p>
                </div>
              </a>
              <a href={profile?.github || 'https://github.com/sahilkumarsahoo07'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 bg-white win98-inset hover:bg-gray-50 transition-colors">
                <Github size={16} className="text-[#000080]" />
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-bold text-gray-500">GitHub</p>
                  <p className="truncate font-mono text-xs">sahilkumarsahoo07</p>
                </div>
              </a>
            </div>
          </section>
        )}

        {/* Project Highlights */}
        {isFullProfile && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Project Highlights</h2>
            <div className="space-y-4">
              {projects?.slice(0, 3).map((proj: any) => (
                <div key={proj._id} className="win98-inset p-3 bg-white border-l-4 border-[#000080]">
                  <h3 className="font-bold flex items-center gap-2">
                    <ExternalLink size={14} className="text-[#000080]" />
                    {proj.title}
                  </h3>
                  <p className="text-xs text-gray-700 mt-1 mb-2">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies?.map((t: string) => (
                      <span key={t} className="text-[9px] bg-[#dfdfdf] border border-gray-400 px-1 py-0.5 font-bold uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Separate sections for specialized windows */}
        {type === 'experience' && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Work Experience</h2>
            <div className="space-y-4">
              {experience?.map((exp: any) => (
                <div key={exp._id} className="win98-inset p-3 bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={14} className="text-[#000080]" />
                    <h3 className="font-bold">{exp.role}</h3>
                  </div>
                  <p className="text-xs font-bold text-gray-600 mb-1">{exp.company}</p>
                  <p className="text-[#808080] text-[10px] mb-2">{exp.duration}</p>
                  <p className="text-sm text-gray-700 leading-snug">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {type === 'certifications' && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications?.map((cert: any) => (
                <div key={cert._id} className="win98-outset p-2 bg-[#dfdfdf] flex items-center gap-3">
                  <Award className="text-[#000080] shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold leading-tight">{cert.name}</h3>
                    <p className="text-[10px] text-gray-600">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {type === 'achievements' && (
          <section>
            <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Notable Achievements</h2>
            <div className="space-y-3">
              {achievements?.map((ach: any) => (
                <div key={ach._id} className="border-b border-[#dfdfdf] pb-2 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={16} className="text-[#000080]" />
                    <h3 className="font-bold">{ach.title}</h3>
                  </div>
                  <p className="text-xs text-gray-700 pl-6">{ach.description}</p>
                  <p className="text-[10px] text-gray-500 pl-6 mt-1">{ach.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
