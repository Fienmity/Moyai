import { getByProps } from "enmity/metro"
import { React } from "enmity/metro/common"

const Video = getByProps("DRMType", "FilterType").default

export default function Settings() {
	const onError = (data) => {
		console.log(data)
	}

	return <Video source={{uri: "https://github.com/FieryFlames/test/raw/main/boom.mp4"}} audioOnly={true} onError={onError} />
}