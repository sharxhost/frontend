import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";

function ParticleBackground(): JSX.Element {
  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  return (
    <Particles id="tsparticles" url="/particles.json" init={particlesInit} />
  );
};

export default ParticleBackground