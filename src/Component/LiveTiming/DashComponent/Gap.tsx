import type { gapInfo_type } from "../Dashtypes";

type Props = {
    gap: gapInfo_type;
    leading: boolean;
}


function Gap({ gap, leading }: Props) {
  return <div className="gap-feild">
    {!leading 
    ? <>
        <h4>{gap.toFront}</h4>
        <p className="gap-toleader">{gap.toLeader}</p>
      </>
    : <>
        <h4>Interval</h4>
        <p className="gap-toleader">Leader</p>
      </>}
  </div>
}

export default Gap