import { Color } from '../math/color';
import { Texture } from './texture';
import { Attenuation, NoAttenuation } from './attenuation';
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export enum MaterialType {
    GENERIC,
    DIFFUSE,
    SPECULAR,
    CLEAR,
    GLOSSY,
    EMISSIVE,
}
export class Material {
    static map: Array<Material> = [];

    type: MaterialType = MaterialType.GENERIC;
    index: number;

    /**
     *
     * @param color
     * @param texture
     * @param normalTexture
     * @param bumpTexture
     * @param bumpMultiplier
     * @param emittance
     * @param attenuation
     * @param ior -> refractive index
     * @param gloss -> reflection cone angle in radians
     * @param tint -> specular and refractive tinting
     * @param transparent
     */
    constructor(
        public color: Color = new Color(),
        public texture?: Texture,
        public normalTexture?: Texture,
        public bumpTexture?: Texture,
        public bumpMultiplier: float = 0,
        public emittance: float = 0,
        public attenuation: Attenuation = NoAttenuation,
        public ior: float = 0,
        public gloss: float = 0,
        public tint: float = 0,
        public transparent: boolean = false
    ) {
        this.index = Material.map.push(this) - 1;
    }

    clone(): Material {
        var material = new Material(
            this.color.clone(),
            this.texture,
            this.normalTexture,
            this.bumpTexture,
            this.bumpMultiplier,
            this.emittance,
            this.attenuation.clone(),
            this.ior,
            this.gloss,
            this.tint,
            this.transparent
        );
        material.type = this.type;
        return material;
    }
}
