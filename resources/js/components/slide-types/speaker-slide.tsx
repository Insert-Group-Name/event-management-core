"use client"
import { Clock, MapPin } from "lucide-react"
import type { Speaker } from "@/types/event-types"

interface SpeakerSlideProps {
  speaker: Speaker
  nextSessions?: Array<{
    title: string
    time: string
    location: string
  }>
}

export default function SpeakerSlide({ speaker, nextSessions = [] }: SpeakerSlideProps) {
  const { name, title, company, bio, photoUrl, socials } = speaker

  return (
    <div className="w-full max-w-md px-4 py-8 text-white relative">
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-4">
            <img
              src={photoUrl || "/placeholder.svg?height=128&width=128"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-lg text-white/80">{title}</p>
          <p className="text-sm text-white/60">{company}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{bio}</p>
        </div>

        {nextSessions && nextSessions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Upcoming Sessions</h3>
            {nextSessions.map((session, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-3 space-y-2">
                <p className="font-medium">{session.title}</p>
                <div className="flex items-center text-sm text-white/70">
                  <Clock size={14} className="mr-1" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <MapPin size={14} className="mr-1" />
                  <span>{session.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
              </svg>
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.5 8.25v10.5H3V8.25h3.5ZM6.75 5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM21 14.75c0-3.314-1.657-5.5-4.25-5.5-1.5 0-2.5.5-3.25 1.5v-2.5h-3.5v10.5h3.5V15c0-1.38.62-2.5 2-2.5s2 1.12 2 2.5v3.75H21v-4Z" />
              </svg>
            </a>
          )}
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          )}
          {socials.website && (
            <a
              href={socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </a>
          )}
        </div>
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90 -z-10" />
    </div>
  )
}

