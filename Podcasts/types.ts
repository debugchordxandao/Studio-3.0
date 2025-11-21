
export interface VideoLesson {
  id: string;
  title: string;
  videoUrl: string; // Genérico para aceitar YouTube ou Drive
  source: 'youtube' | 'drive';
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  driveLink: string;
}
