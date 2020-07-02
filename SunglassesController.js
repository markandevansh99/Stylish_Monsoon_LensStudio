// SunglassesController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the sunglasses template. Has
// a large assortment of exposed inputs and the logic to actually modify the 
// template content based on these inputs

// @ui {"widget":"group_start", "label":"Frame Customization"}
// @input vec4 frameColor = {1, 1, 1, 1} {"widget":"color"}
// @input int frameType = "cat" {"widget": "combobox", "values":[{"label": "Cat", "value": 0}, {"label": "Heart", "value": 1}, {"label": "Round", "value": 2}, {"label": "Aviator", "value": 3}, {"label": "Nerd", "value": 4}]}
// @input int frameMaterial = "matte" {"widget": "combobox", "values":[{"label": "Matte", "value": 0}, {"label": "Metallic", "value": 1}, {"label": "Glossy", "value": 2}]}
// @input bool clearFrame = false
// @input float frameAlpha = 0.5 {"showIf":"clearFrame", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float frameSize = 0.5 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float frameOffset = 0.0 {"widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Lens Customization"}
// @input vec4 lensColor = {1, 1, 1, 1} {"widget":"color"}
// @input float lensAlpha = 0.5 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input int lensRoughness = 0 {"widget":"slider", "min":0, "max":10, "step":1 , "showIf": "customReflection", "showIfValue": false}
// @input bool customReflection = false
// @input Asset.Texture reflectionTexture {"showIf":"customReflection"}
// @input float reflectionIntensity = 1.0 {"widget":"slider", "min":0.0, "max":10.0, "step":0.1, "showIf":"customReflection"}
// @input bool customSprite = false
// @input Asset.Texture spriteTexture {"showIf": "customSprite"}
// @input float spriteIntensity = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf":"customSprite"}
// @input float spriteSize = 0.5 {"widget":"slider", "min":0, "max":1, "step":0.05, "showIf":"customSprite"}
// @input float spriteOffsetX = 0 {"widget":"slider", "min":-1, "max":1, "step":0.05, "showIf":"customSprite"}
// @input float spriteOffsetY = 0 {"widget":"slider", "min":-1, "max":1, "step":0.05, "showIf":"customSprite"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Environment Map"}
// @input Asset.Texture diffTextures
// @input Asset.Texture specTextures
// @input float exposure = 2.0 {"widget":"slider", "min":0.0, "max":10.0, "step":0.1}
// @input float rotation = 90.0 {"widget":"slider", "min":0.0, "max":360.0, "step":1.0}
// @ui {"widget":"group_end"}

// @input bool twoHeads = true

// @ui {"widget":"group_start", "label":"DO NOT EDIT", "showIf": "hideMe", "showIfValue": true}
// @input bool hideMe = false {"showIf": "hideMe"}
// @input Component.ScriptComponent properties
// @ui {"widget":"group_end"}


var logoAspect = 1.0;
var usableWidth = [0.1, 1.1];
var usableHeight = [0.1, 1.1];
var uvWidth = remap( script.spriteSize, 0, 1, usableWidth[0], usableWidth[1] );
var uvHeight = remap( script.spriteSize, 0, 1, usableHeight[0], usableHeight[1] );
var logoOffset = new vec2( script.spriteOffsetX, -script.spriteOffsetY );

var uvAspect = uvWidth / uvHeight;

function onLensTurnOn()
{
    configureFramesCustomization();
    configureLensCustomization();
    configureEnvironmentMap();
    configureFrameTransform();
    configureLogo();
    configureSecondHead();
}
var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn ); 

function configureFramesCustomization()
{
    var frameColor = script.frameColor;

    if( script.properties.api.frames && script.properties.api.frameMaterial )
    {
        for( var i = 0; i < script.properties.api.frames.length; i++ )
        {
            if( script.properties.api.frames[i] )
            {
                script.properties.api.frames[i].enabled = false;
            }
        }
        
        if( script.properties.api.frames[ script.frameType ] )
        {
           script.properties.api.frames[ script.frameType ].enabled = true; 
        }
        
        if( script.properties.api.frameNormals )
        {
            script.properties.api.frameMaterial.mainPass.normalTex = script.properties.api.frameNormals[script.frameType];
        }

        if( script.properties.api.frameParams )
        {
            script.properties.api.frameMaterial.mainPass.materialParamsTex = script.properties.api.frameParams[script.frameMaterial];
        }

        if( script.clearFrame )
        {
            script.properties.api.frameMaterial.mainPass.blendMode = 9;
        }
        else
        {
            script.properties.api.frameMaterial.mainPass.blendMode = 6;
        }

        script.properties.api.frameMaterial.mainPass.baseColor = setColorWithAlpha( frameColor, script.frameAlpha );
    }
}
