import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";

type Step = {
  key: string;
  labelKey: string;
  durationSec: number;
  emoji: string;
};

const defaultSteps = (settings: any): Step[] => {
  const chewing = settings.chewing ?? 15;
  const outside = settings.outside ?? 20;
  const inside = settings.inside ?? 15;

  return [
    {
      key: "chew-br",
      labelKey: "areas.chewBottomRight",
      durationSec: chewing,
      emoji: "A",
    },
    {
      key: "chew-tr",
      labelKey: "areas.chewTopRight",
      durationSec: chewing,
      emoji: "B",
    },
    {
      key: "chew-tl",
      labelKey: "areas.chewTopLeft",
      durationSec: chewing,
      emoji: "C",
    },
    {
      key: "chew-bl",
      labelKey: "areas.chewBottomLeft",
      durationSec: chewing,
      emoji: "D",
    },

    {
      key: "out-left",
      labelKey: "areas.outLeft",
      durationSec: outside,
      emoji: "E",
    },
    {
      key: "out-right",
      labelKey: "areas.outRight",
      durationSec: outside,
      emoji: "F",
    },
    {
      key: "out-front",
      labelKey: "areas.outFront",
      durationSec: outside,
      emoji: "G",
    },

    {
      key: "in-br",
      labelKey: "areas.inBottomRight",
      durationSec: inside,
      emoji: "H",
    },
    {
      key: "in-tr",
      labelKey: "areas.inTopRight",
      durationSec: inside,
      emoji: "I",
    },
    {
      key: "in-tl",
      labelKey: "areas.inTopLeft",
      durationSec: inside,
      emoji: "J",
    },
    {
      key: "in-bl",
      labelKey: "areas.inBottomLeft",
      durationSec: inside,
      emoji: "K",
    },
    {
      key: "in-cb",
      labelKey: "areas.inCenterBottom",
      durationSec: inside,
      emoji: "L",
    },
    {
      key: "in-ct",
      labelKey: "areas.inCenterTop",
      durationSec: inside,
      emoji: "M",
    },
  ];
};

const SETTINGS_KEY = "tbt.settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function BrushingTimer() {
  const { t } = useI18n();
  const settings = loadSettings();
  const steps = useRef<Step[]>(defaultSteps(settings));

  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms
  const [completed, setCompleted] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      const start = Date.now() - elapsed;
      intervalRef.current = window.setInterval(() => {
        setElapsed(Date.now() - start);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, elapsed])

  useEffect(() => {
    const step = steps.current[index];
    if (!step) return;
    if (elapsed >= step.durationSec * 1000) {
      if (index >= steps.current.length - 1) {
        // finished all steps
        setCompleted(true);
        setRunning(false);
        setElapsed(0);
      } else {
        // move to next
        setElapsed(0);
        setIndex((i) => i + 1);
      }
    }
  }, [elapsed, index]);

  const current = steps.current[index];
  const progress = current
    ? Math.min(1, elapsed / (current.durationSec * 1000))
    : 0;

  function handleStart() {
    setRunning(true);
    setElapsed(0);
    setIndex(0);
  }

  function handlePauseToggle() {
    setRunning((r) => !r);
  }

  function handleBack() {
    if (completed) {
      // go to last area and start it
      setCompleted(false)
      setIndex(Math.max(0, steps.current.length - 1))
      setElapsed(0)
      setRunning(true)
      return
    }

    if (elapsed < 3000) {
      // go to previous if exists
      setIndex((i) => Math.max(0, i - 1))
      setElapsed(0)
    } else {
      // restart current
      setElapsed(0)
    }
  }

  function handleRestart() {
    setCompleted(false)
    setIndex(0)
    setElapsed(0)
    setRunning(true)
  }

  return (
    <div className="tbt-timer">
      {!completed && !running && index === 0 && elapsed === 0 ? (
        <div className="start-screen">
          <button className="start-btn" onClick={handleStart}>
            {t("start")}
          </button>
        </div>
      ) : completed ? (
        <div className="done-screen">
          <div className="area-top">
            <div className="area-image-wrap" aria-hidden>
              <img src="/assets/koala-done.png" alt={t('done.message')} className="area-image" />
            </div>
            <div className="area-label">{t('done.message')}</div>
          </div>

          <div className="controls">
            <button className="ctrl" onClick={handleBack}>
              {t("back")}
            </button>
            <button className="ctrl" onClick={handleRestart}>
              {t("restart")}
            </button>
          </div>
        </div>
      ) : (
        <div className="running-screen">
          <div className="area-top">
            <div className="area-image-wrap" aria-hidden>
              {current && (
                <img
                  src={`/assets/koala-${current.key}.png`}
                  alt={t(current.labelKey || "")}
                  className="area-image"
                />
              )}
            </div>
            <div className="area-label">{t(current?.labelKey || "")}</div>
          </div>

          <div className="progress-wrap">
            <div
              className="progress-bar"
              style={{ width: `${progress * 100}%` }}
            />
            <div className="progress-text">
              {Math.floor(elapsed / 1000)}s / {current?.durationSec}s
            </div>
          </div>

          <div className="controls">
            <button className="ctrl" onClick={handleBack}>
              {t("back")}
            </button>
            <button className="ctrl" onClick={handlePauseToggle}>
              {running ? t("pause") : t("continue")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
