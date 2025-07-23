import type { MouseEventHandler } from "react";
import type { gapInfo_type } from "../../../../Type/Dashtypes";


type Props = {
    gap: gapInfo_type;
    leading: boolean;
    intervalTop: boolean;
    handleGapTop: MouseEventHandler;
}


function Gap({ gap, leading, intervalTop, handleGapTop }: Props) {

  return <div className="gap-feild" onClick={handleGapTop}>
    {intervalTop
    ? <>
        <h4>{leading ? "Interval" : gap.toFront}</h4>
        <p className="gap-small">{leading ? "Leader" : gap.toLeader}</p>
      </>
    : <>
        <h4>{leading ? "Leader" : gap.toLeader}</h4>
        <p className="gap-small">{leading ? "Interval" : gap.toFront}</p>
      </>}
  </div>
}

export default Gap