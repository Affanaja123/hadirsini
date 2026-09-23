import Svg, { Path } from "react-native-svg";

export default function HeaderWave() {
  return (
    <Svg
      width="120%"
      height={100}
      viewBox="0 0 1440 320"
      style={{
        position: "absolute",
        bottom: -1,
        left: -30,
      }}
    >
      <Path
        fill="rgba(255,255,255,0.12)"
        d="
          M0,192
          C180,120,360,120,540,170
          C720,220,900,260,1080,240
          C1260,220,1350,180,1440,150
          L1440,320
          L0,320
          Z
        "
      />

      <Path
        fill="rgba(255,255,255,0.20)"
        d="
          M0,230
          C240,160,480,160,720,210
          C960,260,1200,260,1440,210
          L1440,320
          L0,320
          Z
        "
      />
    </Svg>
  );
}