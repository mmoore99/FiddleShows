export class TraktExtendedInfo {
    metadata = false;
    full = false;
    noSeasons = false;
    episodes = false;
    guestStars = false;

    hasAnySet() {
        return this.metadata || this.full || this.noSeasons || this.episodes || this.guestStars;
    }
    
    setMetadata(){
        this.metadata = true;
        return this;
    }

    setFull(){
        this.full = true;
        return this;
    }

    setNoSeasons(){
        this.noSeasons = true;
        return this;
    }
    
    setEpisodes(){
        this.episodes = true;
        return this;
    }
    
    setGuestStars() {
        this.guestStars = true;
        return this;
    }
    
    resolve(){
        let result: string[] = [];
        if (this.metadata) result.push("metadata");
        if (this.full) result.push("full");
        if (this.noSeasons) result.push("noseasons");
        if (this.episodes) result.push("episodes");
        if (this.guestStars) result.push("guest_stars");
        return result;
    }
    
    toString(){
        return this.resolve().join(",");
    }
}