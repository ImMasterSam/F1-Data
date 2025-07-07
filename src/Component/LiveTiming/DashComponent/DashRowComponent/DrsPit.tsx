import type { drspitInfo_type } from "../../../../Type/Dashtypes";

type Props = {
    drspit: drspitInfo_type;
}

const get_DrsPit_text = (drspit: drspitInfo_type) => {
    if (drspit.pitStatus === 1)
        return 'PIT'
    else if (drspit.pitStatus === 2)
        return 'PIT EXIT'
    else
        return 'DRS'
}

const get_label = (drspit: drspitInfo_type) => {
    if (drspit.pitStatus > 0)
        return 'pit'
    else if(drspit.drsStatus === 1)
        return 'ready'
    else if(drspit.drsStatus === 2)
        return 'deploy'
    else
        return ''
}

function DrsPit({ drspit }: Props) {
  return <div className={`drspit-feild ${get_label(drspit)}`}>
    <h3>{get_DrsPit_text(drspit)}</h3>
  </div>
}

export default DrsPit