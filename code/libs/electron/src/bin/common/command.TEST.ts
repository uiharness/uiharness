import { expect } from 'chai';
import { command } from '.';

describe('command', () => {
  it('starts with no command', () => {
    const cmd = command();
    expect(cmd.value).to.eql('');
    expect(cmd.toString()).to.eql('');
  });

  it('starts with a base command', () => {
    const cmd = command('foo');
    expect(cmd.value).to.eql('foo');
    expect(cmd.toString()).to.eql('foo');
  });

  it('adds an argument', () => {
    expect(command('run').arg('force').value).to.eql('run --force');
    expect(command('run').arg('--force').value).to.eql('run --force');
    expect(command('run').arg('---force').value).to.eql('run --force');
    expect(command('run').arg('-force').value).to.eql('run --force');
    expect(command('run').arg(' --force  ').value).to.eql('run --force');
    expect(command('run').arg('   -force  ').value).to.eql('run --force');
  });

  it('adds an argument (alias)', () => {
    expect(command('run').alias('f').value).to.eql('run -f');
    expect(command('run').alias('-f').value).to.eql('run -f');
    expect(command('run').alias('--f').value).to.eql('run -f');
    expect(command('run').alias(' -f  ').value).to.eql('run -f');
    expect(command('run').alias(' --f  ').value).to.eql('run -f');
  });
});
