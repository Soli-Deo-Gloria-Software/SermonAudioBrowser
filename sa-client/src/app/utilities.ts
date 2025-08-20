export const randomString = ():string => {
    return (Math.random().toString(36) + '00000000000000000').substring(7);
  }

export const reduceWaveform = (baseWaveform: number[], maximumNumberOfPeaks: number): number[] => {
  if (baseWaveform.length <= maximumNumberOfPeaks){
    return baseWaveform;
  }
  else{
    let reduced: number[] = [...baseWaveform];
    let interval = Math.ceil(reduced.length / maximumNumberOfPeaks);

    while (reduced.length > maximumNumberOfPeaks)
    {
      let length = reduced.length;
      let oldArray = [...reduced];
      reduced = [];

      for(var i = 0; i < length; i += interval) {
        var numberOfElements = 0;
        var sum = 0;
        var maxIndex = i + interval - 1;

        for (var j = i; j <= maxIndex; j++){
          if (j < length){
            numberOfElements++;
            sum += oldArray[j];
          }
        }

        if (numberOfElements != 0) {
          reduced.push(sum/numberOfElements);
        }
        else{
          reduced.push(sum);
        }
      }
    }

    return reduced;
  }
}

export const DefaultWaveform = (maxNumberOfPeaks:number):number[] =>{
  let peaks:number[] = [];
  let numberOfOscilations = 2;
  let peaksPerOscilation = maxNumberOfPeaks/2/numberOfOscilations;

  let piPerOscellation = Math.PI/peaksPerOscilation;

  for (let i = 0; i < numberOfOscilations; i++)
  {
    for (let j = 1; j <= peaksPerOscilation; j++)
    {
      peaks.push(Math.abs(Math.sin(2*piPerOscellation*j))*70);
    }
  }

  return peaks;
}

export const EnumParse = <T>(enumObject: T, value: string): T[keyof T] | undefined=> enumObject[value as keyof typeof enumObject];

// Gutter percent for waveform peaks. This was done with trial and error.
// I should probably refactor to make the gutter dependent on the size of the reduced waveform,
// but it kindof doesn't really matter, since target max peaks is also effectively a constant.
export const peakGutterPercent = 0.05;