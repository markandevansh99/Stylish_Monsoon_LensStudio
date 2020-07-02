// -----JS CODE-----
// SegmentationController.js
// Version: 0.0.1
// Event: Initialized
// Description: A controller script that allows you to set a segmented background image 
// or color effect masked by a segmentation mask texture

// @input Asset.Texture segmentationTexture

// @input bool useBackgroundColor = false { "label":"Use Background Color" }
// @ui {"widget": "group_start", "label": "Background Color", "showIf":"useBackgroundColor"}
// @input vec3 color {"widget":"color"}
// @input float colorAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @ui {"widget": "group_end"}

// @input bool useImage = true
// @ui {"widget": "group_start", "label": "Image", "showIf":"useImage"}
// @input Asset.Texture imageTexture
// @input float imageAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input int imageBlendMode = 0 {"widget":"combobox", "values":[{"label":"Normal", "value":0}, {"label": "Screen", "value": 3}, {"label": "Multiply", "value": 10} ]}

// @input bool tiled = false
// @input int fillMode = 1 {"widget":"combobox", "values":[{"label":"Fit", "value":0}, {"label":"Fill", "value":1}, {"label":"Stretch", "value":2}],  "showIf":"tiled", "showIfValue":"false"}
// @ui {"widget": "group_start", "label": "Tiled Settings", "showIf":"tiled", "showIfValue":"true"}
// @input float tileDensity = 1.0 {"widget":"slider", "min":1.0, "max":20.0, "step":1.0}
// @input bool scrolling = false
// @input float scrollSpeedX = -0.2 {"widget":"slider", "min":-5.0, "max":5.0, "step":0.1, "showIf":"scrolling"}
// @input float scrollSpeedY = -0.2 {"widget":"slider", "min":-5.0, "max":5.0, "step":0.1, "showIf":"scrolling"}
// @ui {"widget": "group_end"}
// @ui {"widget": "group_end"}

// @input bool usePostEffect = true
// @ui {"widget": "group_start", "label": "Post Effect", "showIf":"usePostEffect"}
// @input Asset.Texture postEffectTexture
// @input float postEffectAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @ui {"widget": "group_end"}

// @input bool advanced = true
// @ui {"widget": "group_start", "label": "Advanced", "showIf":"advanced"}
// @input SceneObject[] enableOnSegmentation
// @input Component.Camera cameraMasked
// @input Component.Camera orthographicCameraMasked
// @input Component.Image backgroundColorBillboard
// @input Component.Image imageBillboard
// @input Asset.Texture deviceCameraTexture
// @input Asset.Material tileMat
// @input Asset.Material tileScrollingMat
// @input Asset.Material fillMat
// @input Component.PostEffectVisual postEffect
// @ui {"widget": "group_end"}

var segmentationTextureReady = false;
var fillModeEnums = [ StretchMode.Fit, StretchMode.Fill, StretchMode.Stretch ];

function turnOn( eventData )
{
	configureSegmentationMasks();
	configureBackgroundColor();
	configureImage();
	configurePostEffect();
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind( turnOn );

function update( eventData )
{
	if( !script.segmentationTexture )
	{
		print( "SegmentationController, ERROR: Make sure to set the segmentation texture");
		return;
	}

	if( !segmentationTextureReady )
	{
		segmentationTextureReady = script.segmentationTexture.control.getWidth() > 1;
		
		for( var i = 0; i < script.enableOnSegmentation.length; i++ )
		{
			if( script.enableOnSegmentation[i] )
			{
				script.enableOnSegmentation[i].enabled = segmentationTextureReady;
			}
		}
	}
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind( update );

function configureSegmentationMasks()
{
	if( !script.segmentationTexture )
	{
		print( "SegmentationController, ERROR: Make sure to set the segmentation texture");
		return;
	}

	if( !script.cameraMasked )
	{
		print( "SegmentationController, ERROR: Camera Masked is not set");
		return;
	}

	if( !script.orthographicCameraMasked )
	{
		print( "SegmentationController, ERROR: Orthographic Camera Masked is not set");
		return;
	}

	script.cameraMasked.maskTexture = script.segmentationTexture;
	script.orthographicCameraMasked.maskTexture = script.segmentationTexture;
}


