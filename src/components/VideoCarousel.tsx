import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);
import { hightlightsSlides } from '../constants';
import { pauseImg, playImg, replayImg } from '../utils';

const VideoCarousel = () => {
  const [loadedData, setLoadedData] = useState<
    React.SyntheticEvent<HTMLVideoElement, Event>[]
  >([]);
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const { isEnd, isLastVideo, isPlaying, startPlay, videoId } = video;

  const videoRef = useRef<HTMLVideoElement[]>([]);
  const videoSpanRef = useRef<HTMLSpanElement[]>([]);
  const videoDivRef = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    });

    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    let currentProgess = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let animation = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(animation.progress() * 100);
          if (progress !== currentProgess) {
            currentProgess = progress;
            gsap.to(videoDivRef.current[videoId], {
              width: getWidthForProgress(),
            });

            gsap.to(span[videoId], {
              width: `${currentProgess}%`,
              backgroundColor: 'white',
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            });
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            });
          }
        },
      });

      if (videoId === 0) {
        animation.restart();
      }

      const animationUpdate = () => {
        animation.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animationUpdate);
      } else {
        gsap.ticker.remove(animationUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleLoadedMetaData = (
    _: number,
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => setLoadedData((prev) => [...prev, e]);
  const getWidthForProgress = () => {
    if (window.innerWidth < 760) {
      return '10vw';
    } else if (window.innerWidth < 1200) {
      return '10vw';
    }
    return '4vw';
  };

  const handleProcess = (type: string, i?: number) => {
    switch (type) {
      case 'video-end':
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: i! + 1 }));
        break;
      case 'video-last':
        setVideo((prev) => ({ ...prev, isLastVideo: true }));
        break;
      case 'video-reset':
        setVideo((prev) => ({ ...prev, isLastVideo: false, videoId: 0 }));
        break;
      case 'play':
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      case 'pause':
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className='flex items-center'>
        {hightlightsSlides.map((slide, i) => (
          <div key={slide.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video
                  id='video'
                  playsInline={true}
                  preload='auto'
                  muted
                  className={`${
                    slide.id === 2 && 'translate-x-44'
                  } pointer-events-none`}
                  ref={(el) => (videoRef.current[i] = el!)}
                  onPlay={() => {
                    setVideo((prev) => {
                      return { ...prev, isPlaying: true };
                    });
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last')
                  }
                >
                  <source src={slide.video} type='video/mp4' />
                </video>
              </div>

              <div className='absolute top-12 left-[5%] z-10'>
                {slide.textLists.map((text) => (
                  <p key={text} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, i) => (
            <span
              className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
              key={i}
              ref={(el) => (videoDivRef.current[i] = el!)}
            >
              <span
                className='absolute h-full w-full rounded-full'
                ref={(el) => (videoSpanRef.current[i] = el!)}
              ></span>
            </span>
          ))}
        </div>
        <button className='control-btn'>
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={() =>
              isLastVideo
                ? handleProcess('video-reset')
                : !isPlaying
                ? handleProcess('play')
                : handleProcess('pause')
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
